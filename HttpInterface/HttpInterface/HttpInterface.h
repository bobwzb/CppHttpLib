#pragma once
#include <string>
#include <tchar.h>
#include <stdio.h>
#include <Windows.h>

using std::string;
using std::wstring;

#define HEADER_USER_AGENT			"User-Agent"
#define HEADER_CONNECTION			"Connection"
#define HEADER_ACCEPT				"Accept"
#define HEADER_ACCEPT_ENCODING		"Accept-Encoding"
#define HEADER_ACCEPT_LANGUAGE		"Accept-Language"
#define HEADER_CONTENT_TYPE			"Content-Type"
#define HEADER_HOST					"Host"
#define HEADER_RANGE				"Range"
#define HEADER_LOCATION				"Location"
#define HEADER_CONTENT_LENGTH		"Content-Length"

#define HINTERNET PVOID

static const char default_http_version[] = "HTTP/1.1";
static const char default_user_agent[] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.4044.92 Safari/537.36";
static const char default_accept[] = "*/*";
static const char default_connection[] = "Keep-Alive";
static const char default_language[] = "en;q=0.6";
static const char http_newline[] = "\r\n";

struct HttpParamsData
{
	void *lpparam;
	HttpCallback *callback;
	ErrorType errcode;
};

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
	errorConnect,
	errorSend,
	error404,
	download,
	userCancel,
	header,
	overBuffer,
	Unknowm,
};

enum InterfaceType {
	SocketType,
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
	virtual string Request(LPCSTR lpUrl, RequestType type, LPCSTR PostData = NULL, LPCSTR header = NULL)=0;
	virtual string Request(LPCWSTR lpUrl, RequestType type, LPCSTR PostData = NULL, LPCWSTR header = NULL)=0;
};

class WinHttp : public WinNetHttp {
public:
	virtual void setTimeOut(int connectTime, int sendTime, int RecvTime)=0;
};

