#include "pch.h"
#include "socketHttp.h"
#include <Shlwapi.h>
#include "httpHeader.h"
#include "tool.h"
#include <ws2tcpip.h>
#pragma comment (lib, "ws2_32")

httpSocket::httpSocket(): m_socket(INVALID_SOCKET)
{
	memset(&m_paramsData, 0, sizeof(HttpParamsData));
}

httpSocket::~httpSocket()
{
	if (INVALID_SOCKET != m_socket)
		closesocket(m_socket);
}

bool httpSocket::InitSocket(const string& strHostName, const WORD sPort)
{
	bool bRes = false;
	try
	{
		//search for id address
		addrinfo hints, *res;
		memset(&hints, 0, sizeof(addrinfo));
		hints.ai_socktype = SOCK_STREAM;
		hints.ai_family = AF_INET;
		if (getaddrinfo(strHostName.c_str(), NULL, &hints, &res) ==NULL)
			throw errorQuery;
		//m_strIpAddr = A2U((sockaddr_in*)(res->ai_addr))->sin_addr.s_addr);
		if (m_socket!= INVALID_SOCKET)
			closesocket(m_socket);
		m_socket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
		if (m_socket== INVALID_SOCKET)
			throw errorSocket;
		int nSec = 1000 * 10;//count down to end the link
		setsockopt(m_socket, SOL_SOCKET, SO_RCVTIMEO, (const char*)&nSec, sizeof(int));
		sockaddr_in		addrServer;
		addrServer.sin_family = AF_INET;
		addrServer.sin_port = htons(sPort);
		addrServer.sin_addr.S_un.S_addr = ((sockaddr_in*)(res->ai_addr))->sin_addr.s_addr;
		if (SOCKET_ERROR == connect(m_socket, (SOCKADDR*)&addrServer, sizeof(addrServer)))
			throw errorConnect;
		bRes = true;
		//res = true;
	}
	catch (ErrorType error)
	{
		m_paramsData.errorcode = error;
	}
	return bRes;
}

bool httpSocket::downloadFile(LPCWSTR lpUrl, LPCWSTR lpFilePath)
{
	bool res = false;
	FILE* fp = NULL;
	BYTE* pBuffer = NULL;
	try
	{
		wstring strHostName, strPage;
		u_short uPort = 80;
		ParseUrlW(lpUrl, strHostName, strPage, uPort);
		if (uPort == 443) {//socket doesn't support https
			return false;
		}
		string host = U2A(strHostName);
		if (!InitSocket(host, uPort))
			throw L"";
		m_header.setHost(host);
		//might re-direction back
	__request:
		m_header.setRequestPath(U2A(strPage));
		std::string strSend = m_header.toString(httpGet);
		int nRet = send(m_socket, strSend.c_str(), strSend.size(), 0);
		if (SOCKET_ERROR == nRet)
			throw errorSend;
		int		nRecvSize = 0, nWriteSize = 0;
		double	nFileSize = 0, nLoadSize = 0;
		bool	bFilter = false;//need to filter the head of return
		if (FileExistW(lpFilePath))
			DeleteFile(lpFilePath);
		_wfopen_s(&fp, lpFilePath, L"wb+");
		if (NULL == fp)
			throw errorCreateFile;
		pBuffer = (BYTE*)malloc(4096 + 1);
		do
		{
			nRecvSize = recv(m_socket, (char*)pBuffer, 4096, 0);
			if (SOCKET_ERROR == nRecvSize)
				throw errorSocket;
			if (nRecvSize > 0)
			{
				pBuffer[nRecvSize] = '\0';
				if (!bFilter)
				{
					std::string str((char*)pBuffer);
					int nPos = str.find("\r\n\r\n");
					if (-1 == nPos)
						continue;
					std::string strHeader;
					strHeader.append((char*)pBuffer, nPos);
					HttpHeader header(strHeader);
					int nHttpValue = header.getReturnVal();
					if (404 == nHttpValue)
					{
						throw error404;
					}
					if (nHttpValue > 300 && nHttpValue < 400)
					{
						wstring strReLoadUrl = A2U(header.getVal(HEADER_LOCATION));
						if (strReLoadUrl.find(L"http://") != 0)
						{
							strPage = strReLoadUrl;
							goto __request;
						}
						if (INVALID_SOCKET != m_socket)
						{
							closesocket(m_socket);
							m_socket = INVALID_SOCKET;
						}
						free(pBuffer);
						pBuffer = NULL;
						fclose(fp);
						fp = NULL;
						return downloadFile(strReLoadUrl.c_str(), lpFilePath);
					}
					nFileSize = atof(header.getVal(HEADER_CONTENT_LENGTH).c_str());
					nWriteSize = nRecvSize - nPos - 4;
					if (nWriteSize > 0)
					{
						fwrite(pBuffer + nPos + 4, nWriteSize, 1, fp);
						nLoadSize += nRecvSize;
						if (m_paramsData.callback)
							m_paramsData.callback->DownloadCallback(m_paramsData.lpparam, loading, nFileSize, nLoadSize);
					}
					if (nFileSize == nLoadSize)
					{
						if (m_paramsData.callback)
							m_paramsData.callback->DownloadCallback(m_paramsData.lpparam, finished, nFileSize, nLoadSize);
						res = true;
						break;
					}
					bFilter = true;
					continue;
				}
				fwrite(pBuffer, nRecvSize, 1, fp);
				nLoadSize += nRecvSize;
				if (m_paramsData.callback)
					m_paramsData.callback->DownloadCallback(m_paramsData.lpparam, loading, nFileSize, nLoadSize);
				if (nLoadSize >= nFileSize)
				{
					res = true;
					if (m_paramsData.callback)
						m_paramsData.callback->DownloadCallback(m_paramsData.lpparam, finished, nFileSize, nLoadSize);
					break;
				}
			}
		} while (nRecvSize > 0);
	}
	catch (ErrorType error)
	{
		m_paramsData.errorcode = error;
		if (m_paramsData.callback)
			m_paramsData.callback->DownloadCallback(m_paramsData.lpparam, failed, 0, 0);
	}
	if (pBuffer)
	{
		free(pBuffer);
		pBuffer = NULL;
	}
	if (fp)
	{
		fclose(fp);
		fp = NULL;
	}
	if (!res)//download fail
		DeleteFile(lpFilePath);
	return res;
}

void httpSocket::setDownloadCallback(HttpCallback* pCallback, void* pParam)
{
	m_paramsData.callback = pCallback;
	m_paramsData.lpparam = pParam;
}

void httpSocket::addHeader(LPCSTR key, LPCSTR value)
{
	if (isEmptyString(key) || isEmptyString(value)) {
		return;
	}
	m_header.addHeader(std::string(key), std::string(value));
}