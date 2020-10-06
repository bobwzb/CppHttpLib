#pragma once
#include <string>
#include <map>
#include <WinSock2.h>
#include "httpHeader.h"

using std::wstring;
using std::string;
using std::map;

class httpSocket : public SocketHttp {
	SOCKET m_socket;
	wstring	m_strIpAddr;
	HttpHeader m_header;
	HttpParamsData m_paramsData;
protected:
	bool	InitSocket(const string& strHostName, const WORD sPort);
public:
	httpSocket();
	virtual ~httpSocket();
	virtual bool downloadFile(LPCWSTR lpUrl, LPCWSTR lpFilePath);
	virtual void setDownloadCallback(HttpCallback* pCallback, void* pParam);
	virtual ErrorType getErrorCode() { return m_paramsData.errorcode; }
	virtual	LPCWSTR	getIpAddr()const { return m_strIpAddr.c_str(); }
	virtual	void freeInstance() { delete this; }
	virtual void addHeader(LPCSTR key, LPCSTR value);
};