#include "pch.h"
#include "httpHeader.h"
#include <iostream>

HttpHeader::HttpHeader() {

}

HttpHeader::HttpHeader(const char* pHeader) {
	returnVal = 0;
	Resolve(string(pHeader));
}

HttpHeader::HttpHeader(const string& strHeader) {
	returnVal = 0;
	Resolve(strHeader);
}

HttpHeader::~HttpHeader() {}

string HttpHeader::getVal(const string& key) {
	string res="";
	auto it = headers.find(key);
	if (it != headers.end())
		res = it->second;
	else {
		std::cout << "Key is not stored in the map! Please check your input." << std::endl;
		res = "-1";
	}
	return res;
}

void HttpHeader::addHeader(const string& key, const string& val) {
	headers.insert({ key,val });
}

void HttpHeader::setHost(const string& host) {
	headers.insert({ HEADER_HOST,host });
}

void HttpHeader::setUserAgent(const string& userAgent) {
	headers.insert({ HEADER_USER_AGENT, userAgent });
}

void HttpHeader::setRange(__int64 range) {
	char buffer[64] = {0};
	sprintf_s(buffer, "bytes=%i64d-", range);
	headers.insert({ HEADER_RANGE,string(buffer) });
}

string HttpHeader::toString(RequestType type) {
	if (httpVersion.empty()) {
		httpVersion.assign(default_http_version);
	}
	if (headers.find(HEADER_USER_AGENT) == headers.end()) {
		headers.insert(std::make_pair(HEADER_USER_AGENT, default_user_agent));
	}
	if (headers.find(HEADER_CONNECTION) == headers.end()) {
		headers.insert(std::make_pair(HEADER_USER_AGENT, default_http_version));
	}
	if (headers.find(HEADER_ACCEPT) == headers.end()) {
		headers.insert(std::make_pair(HEADER_ACCEPT, default_accept));
	}
	if (headers.find(HEADER_CONNECTION) == headers.end()) {
		headers.insert(std::make_pair(HEADER_CONNECTION, default_connection));
	}
	if (headers.find(HEADER_ACCEPT_LANGUAGE) == headers.end()) {
		headers.insert(std::make_pair(HEADER_ACCEPT_LANGUAGE, default_language));
	}
	std::string header((type ==httpPost ) ? "POST " : "GET ");
	header += requestPath;
	header.append(" ");
	header += httpVersion;
	header.append(http_newline);
	for (auto itor = headers.begin(); itor != headers.end(); ++itor) {
		header += itor->first;
		header.append(": ");
		header += itor->second;
		header.append(http_newline);
	}
	header.append(http_newline);
	header.append(http_newline);
	return std::move(header);
}

string HttpHeader::toHeader() {
	if (headers.find(HEADER_USER_AGENT) == headers.end()) {
		headers.insert(std::make_pair(HEADER_USER_AGENT, default_user_agent));
	}
	if (headers.find(HEADER_CONNECTION) == headers.end()) {
		headers.insert(std::make_pair(HEADER_USER_AGENT, default_http_version));
	}
	if (headers.find(HEADER_ACCEPT) == headers.end()) {
		headers.insert(std::make_pair(HEADER_ACCEPT, default_accept));
	}
	if (headers.find(HEADER_CONNECTION) == headers.end()) {
		headers.insert(std::make_pair(HEADER_CONNECTION, default_connection));
	}
	if (headers.find(HEADER_ACCEPT_LANGUAGE) == headers.end()) {
		headers.insert(std::make_pair(HEADER_ACCEPT_LANGUAGE, default_language));
	}
	std::string header;
	for (auto it = headers.begin(); it != headers.end(); ++it) {
		header += it->first;
		header.append(": ");
		header += it->second;
		header.append(http_newline);
	}
	return std::move(header);
}

bool HttpHeader::Resolve(const string header)
{
	int nStartPos = 0, nFindPos = 0, nLineIndex = 0;
	std::string strLine, strKey, strValue;
	do
	{
		nFindPos = header.find("\r\n", nStartPos);
		if (-1 == nFindPos)
			strLine = header.substr(nStartPos, header.size() - nStartPos);
		else
		{
			strLine = header.substr(nStartPos, nFindPos - nStartPos);
			nStartPos = nFindPos + 2;
		}
		if (0 == nLineIndex)
		{
			httpVersion = strLine.substr(0, 8);
			int nSpace1 = strLine.find(" ");
			int nSpace2 = strLine.find(" ", nSpace1 + 1);
			returnVal = atoi(strLine.substr(nSpace1 + 1, nSpace2 - nSpace1 - 1).c_str());
			strContent = strLine.substr(nSpace2 + 1, strLine.size() - nSpace2 - 1);
			nLineIndex++;
			continue;
		}
		int nSplit = strLine.find(": ");
		strKey = strLine.substr(0, nSplit);
		strValue = strLine.substr(nSplit + 2, strLine.size() - nSplit - 2);
		std::pair<string, string> data;
		data.first = strKey;
		data.second = strValue;
		headers.insert(std::move(data));
		nLineIndex++;
	} while (nFindPos != -1);
	return true;
}