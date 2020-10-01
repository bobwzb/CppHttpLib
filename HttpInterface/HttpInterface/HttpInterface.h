#pragma once
#include <string>
#include <tchar.h>
#include <stdio.h>
#include <Windows.h>
using std::string;
using std::wstring;

enum RequestType
{
	httpGet,
	httpPost,
};

enum downloadState {
	loading,
	failed,
	finished,
};

enum ErrorType {
	success,
	init,
	connect,
	send,
	error404,
	download,
	userCancel,
	header,
	overBuffer,
	Unknowm,
};

enum InterfaceType {
	socket,
	winNet,
	winHttp,
};

class HttpCallback {
public:
	virtual void DownloadCallbeck(void* pParam, downloadState state, double totalSize, double loadSize) = 0;
	virtual bool NeedStop() = 0;
};

class HttpBase
{
public:
	virtual void setDownloadCallback(HttpCallback* pCallback, void* pParam) = 0;
	virtual bool downloadFile(LPCWSTR lpUrl, LPCWSTR lpFilePath) = 0;
	virtual bool downloadToMem(LPCWSTR lpUrl, OUT void** Buffer, OUT int* size) = 0;
	virtual void freeInstance() = 0;
	virtual ErrorType getErrorType() = 0;
	virtual void AddHeader(LPCSTR key, LPCSTR val) = 0;
};

class ScoketHttp:public HttpBase {
public:
	virtual LPCWSTR getIpAddress() = 0;
};

class WinNetHttp:public HttpBase {
public:
	virtual string Request(LPCSTR lpUrl, RequestType type, LPCSTR PostData = NULL, LPCSTR header = NULL);
	virtual string Request(LPCWSTR lpUrl, RequestType type, LPCSTR PostData = NULL, LPCWSTR header = NULL);
};

class WinHttp : public WinNetHttp {
public:
	virtual void setTimeOut(int connectTime, int sendTime, int RecvTime);
};

