#include "WinNetHttp.h"
#include <WinInet.h>
#include "tool.h"
WinInetHttp::WinInetHttp() {
	https=false;
	session=nullptr;
	connect=nullptr;
	request=nullptr;
	memset(&data, 0, sizeof(HttpParamsData));
}

WinInetHttp::~WinInetHttp() {
	release();
}

string WinInetHttp::Request(LPCSTR pUrl, RequestType type, LPCSTR pPostData = NULL, LPCSTR pHeader = NULL) {
	string res;
	try {
		if (pUrl == nullptr) throw noParam;
		release();
		session = InternetOpen(L"Http-connect", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, NULL);
		if (session == nullptr) throw init;
		INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
		string hostName, pageName;
		ParseUrl(pUrl, hostName, pageName, port);
		if (port == INTERNET_DEFAULT_HTTPS_PORT) https = true;
		connect = InternetConnectA(session, hostName.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, NULL, NULL);
		if (connect == nullptr) throw 	errorConnect;
		DWORD dwflag = INTERNET_FLAG_RELOAD;// force download from the net
		if(https) dwflag|= (INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID);
		request = HttpOpenRequestA(connect, (type == httpGet) ? "GET" : "POST", pageName.c_str(), "HTTP/1.1", NULL, NULL, dwflag,NULL);
		if (request == nullptr) throw init;
		BOOL ret = FALSE;
		DWORD headerSize = (pHeader == nullptr) ? 0 : strlen(pHeader);
		DWORD dataSize = (pPostData == nullptr) ? 0 : strlen(pPostData);
		string httpHeaders = header.toHeader();
		HttpAddRequestHeadersA(request, httpHeaders.c_str(), httpHeaders.size(), HTTP_ADDREQ_FLAG_ADD | HTTP_ADDREQ_FLAG_REPLACE);
		ret = HttpSendRequestA(request, pHeader, headerSize, (LPVOID)pPostData, dataSize);
		if (!ret) throw errorSend;
		char buffer[4096 + 1] = { '0' };
		DWORD readSize = 4096;
		if (!HttpQueryInfoA(request, HTTP_QUERY_RAW_HEADERS, buffer, &readSize, NULL))
			throw errorQuery;
		if (strstr(buffer, "404")) throw error404;
		while (true)
		{
			ret = InternetReadFile(request, buffer, 4096, &readSize);
			if (!ret || (readSize==0))
				break;
			buffer[readSize] = '\0';
			res.append(buffer, readSize);
		}
	}
	catch(ErrorType error){
		data.errcode = error;
	}
	return res;
}

string WinInetHttp::Request(LPCWSTR lpUrl, RequestType type, LPCSTR lpPostData/* = NULL*/, LPCWSTR lpHeader/*=NULL*/) {
	string res;
	try {
		if (lpUrl == nullptr) throw noParam;
		release();
		session = InternetOpen(L"Http-connect", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, NULL);
		if (session == nullptr) throw init;
		INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
		wstring hostName, pageName;
		ParseUrlW(lpUrl, hostName, pageName, port);
		if (port == INTERNET_DEFAULT_HTTPS_PORT) https = true;
		connect = InternetConnectW(session, hostName.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, NULL, NULL);
		if (connect == nullptr) throw 	errorConnect;
		DWORD dwflag = INTERNET_FLAG_RELOAD;// force download from the net
		if (https) dwflag |= (INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID);
		request = HttpOpenRequestW(connect, (type == httpGet) ? L"GET" : L"POST", pageName.c_str(), L"HTTP/1.1", NULL, NULL, dwflag, NULL);
		if (request == nullptr) throw init;
		BOOL ret = FALSE;
		DWORD headerSize = (lpHeader == nullptr) ? 0 : wcslen(lpHeader);
		DWORD dataSize = (lpPostData == nullptr) ? 0 : strlen(lpPostData);
		string httpHeaders = header.toHeader();
		HttpAddRequestHeadersA(request, httpHeaders.c_str(), httpHeaders.size(), HTTP_ADDREQ_FLAG_ADD | HTTP_ADDREQ_FLAG_REPLACE);
		ret = HttpSendRequestW(request, lpHeader, headerSize, (LPVOID)lpPostData, dataSize);
		if (!ret) throw errorSend;
		char buffer[4096 + 1] = { '0' };
		DWORD readSize = 4096;
		if (!HttpQueryInfoA(request, HTTP_QUERY_RAW_HEADERS, buffer, &readSize, NULL))
			throw errorQuery;
		if (strstr(buffer, "404")) throw error404;
		while (true)
		{
			ret = InternetReadFile(request, buffer, 4096, &readSize);
			if (!ret || (readSize == 0))
				break;
			buffer[readSize] = '\0';
			res.append(buffer, readSize);
		}
	}
	catch (ErrorType error) {
		data.errcode = error;
	}
	return res;
}

bool WinInetHttp::DownloadFile(LPCWSTR lpUrl, LPCWSTR lpFilePath) {
	bool res = false;
	BYTE* pBuffer = NULL;
	FILE* fp = NULL;
	try {
		if (lpUrl == nullptr) throw illegalUrl;
		release();
		session = InternetOpen(L"Http-connect", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, NULL);
		if (session == nullptr) throw init;
		INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
		wstring hostName, pageName;
		ParseUrlW(lpUrl, hostName, pageName, port);
		if (port == INTERNET_DEFAULT_HTTPS_PORT) https = true;
		connect = InternetConnectW(session, hostName.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, NULL, NULL);
		if (connect == nullptr) throw 	errorConnect;
		DWORD dwflag = INTERNET_FLAG_RELOAD;// force download from the net
		if (https) dwflag |= (INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID);
		request = HttpOpenRequestW(connect, L"GET" , pageName.c_str(), L"HTTP/1.1", NULL, NULL, dwflag, NULL);
		if (request == nullptr) throw init;
		BOOL ret = FALSE;
		string httpHeaders = header.toHeader();
		HttpAddRequestHeadersA(request, httpHeaders.c_str(), httpHeaders.size(), HTTP_ADDREQ_FLAG_ADD | HTTP_ADDREQ_FLAG_REPLACE);
		ret = HttpSendRequestW(request, NULL, 0, NULL, 0);
		if (!ret) throw errorSend;
		char buffer[4096 + 1] = { '0' };
		DWORD readSize = 4096;
		if (!HttpQueryInfoA(request, HTTP_QUERY_RAW_HEADERS, buffer, &readSize, NULL))
			throw errorQuery;
		if (strstr(buffer, "404")) throw error404;
		buffer[readSize] = '\0';
		double fileSize = atof(buffer);
		int nMallocSize = fileSize < 4096 ? (int)fileSize : 4096;
		pBuffer = (BYTE*)malloc(nMallocSize);
		int nFindPos = 0;
		wstring strSavePath(lpFilePath);
		while (wstring::npos != (nFindPos = strSavePath.find(L"\\", nFindPos)))
		{
			wstring strChildPath = strSavePath.substr(0, nFindPos);
			if (INVALID_FILE_ATTRIBUTES == ::GetFileAttributes(strChildPath.c_str()))
				CreateDirectory(strChildPath.c_str(), NULL);
			nFindPos++;
		}
		_wfopen_s(&fp, strSavePath.c_str(), L"wb+");
		if (NULL == fp) throw errorCreateFile;
		double uWriteSize = 0;
		while (true)
		{
			ret = InternetReadFile(request, pBuffer, nMallocSize, &readSize);
			if (!ret || ( readSize==0 ))
				break;
			size_t nWrite = fwrite(pBuffer, readSize, 1, fp);
			if (nWrite == 0)
				throw errorWriteFile;
			uWriteSize += readSize;
			if (data.callback)
				data.callback->DownloadCallback(data.lpparam, loading, fileSize, uWriteSize);
		}
		fclose(fp);
		if (data.callback)
			data.callback->DownloadCallback(data.lpparam, finished, fileSize, uWriteSize);
		res = true;
	}
	catch(ErrorType type){
		data.errcode = type;
		if (data.callback)
			data.callback->DownloadCallback(data.lpparam, failed, 0, 0);
	}
	return res;
}

void WinInetHttp::AddHeader(LPCSTR key, LPCSTR value)
{
	if (isEmptyString(key) || isEmptyString(value)) {
		return;
	}
	header.addHeader(string(key), string(value));
}

void WinInetHttp::releaseHandle(HINTERNET& hInternet)
{
	if (hInternet)
	{
		InternetCloseHandle(hInternet);
		hInternet = NULL;
	}
}

void WinInetHttp::release()
{
	releaseHandle(request);
	releaseHandle(connect);
	releaseHandle(session);
}

void WinInetHttp::SetDownloadCallback(HttpCallback* pCallback, void* pParam)
{
	data.callback = pCallback;
	data.lpparam = pParam;
}