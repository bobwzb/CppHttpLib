#pragma once
#include <string>
#include <map>
#include "HttpInterface.h"
using std::string;
using std::map;

class HttpHeader {
	int returnVal;
	string httpVersion;
	string strContent;
	string requestPath;
	map<string, string> headers;
protected:
	bool Resolve(const string header);
private:
	HttpHeader();
	HttpHeader(const char* pHeader);
	HttpHeader(const std::string& strHeader);
	virtual	~HttpHeader(void);

	const string& getHttpVersion() const { return httpVersion; }

	void setHttpVersion(const string& version) { httpVersion = version; }

	void setRequestPath(const string& path) { requestPath = path; }

	const int getReturnVal() const { return returnVal; }

	const char* getContent() const { return strContent.c_str(); }

	string getVal(string& key);

	void addHeader(const string& key, const string& val);

	void setUserAgent(const string& userAgent);

	void setHost(const string& host);

	void setRange(__int64 range);

	string toString(RequestType type);

	string toHeader();
};