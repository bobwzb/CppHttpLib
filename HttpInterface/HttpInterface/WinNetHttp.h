#pragma once
#include <map>
#include "httpHeader.h"

class WinInetHttp : public WinNetHttp {
	bool https;
	HINTERNET session;
	HINTERNET connect;
	HINTERNET request;
	HttpHeader header;
	HttpParamsData data;
protected:
	void releaseHandle(HINTERNET& internet);
	void realese();
public:
	WinInetHttp();
	virtual ~WinInetHttp() {};
	virtual string	Request(LPCSTR pUrl, RequestType type, LPCSTR pPostData = NULL, LPCSTR pHeader = NULL);
	virtual string	Request(LPCWSTR pUrl, RequestType type, LPCSTR pPostData = NULL, LPCWSTR pHeader = NULL);
	virtual bool	DownloadFile(LPCWSTR lpUrl, LPCWSTR lpFilePath);
	virtual bool	DownloadToMem(LPCWSTR lpUrl, OUT void** ppBuffer, OUT int* nSize);
	virtual void	SetDownloadCallback(HttpCallback* pCallback, void* pParam);
	virtual ErrorType GetErrorCode() { return data.errcode; }
	virtual	void	FreeInstance() { delete this; }
	virtual void AddHeader(LPCSTR key, LPCSTR value);
};