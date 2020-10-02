#pragma once
#include <string>
#include <Windows.h>
using std::wstring;
using std::string;

inline void ParseUrlW(LPCWSTR lpUrl, wstring& strHostName, wstring& strPage, WORD& sPort)
{
	sPort = 80;
	wstring strTemp(lpUrl);
	int nPos = strTemp.find(L"http://");
	if (wstring::npos != nPos)
		strTemp = strTemp.substr(nPos + 7, strTemp.size() - nPos - 7);
	else
	{
		nPos = strTemp.find(L"https://");
		if (wstring::npos != nPos)
		{
			sPort = 443;//INTERNET_DEFAULT_HTTPS_PORT;
			strTemp = strTemp.substr(nPos + 8, strTemp.size() - nPos - 8);
		}
	}
	nPos = strTemp.find('/');
	if (wstring::npos == nPos)
		strHostName = strTemp;
	else
		strHostName = strTemp.substr(0, nPos);
	int nPos1 = strHostName.find(':');
	if (nPos1 != wstring::npos)
	{
		wstring strPort = strTemp.substr(nPos1 + 1, strHostName.size() - nPos1 - 1);
		strHostName = strHostName.substr(0, nPos1);
		sPort = (WORD)_wtoi(strPort.c_str());
	}
	if (wstring::npos == nPos) {
		strPage = '/';
		return;
	}
	strPage = strTemp.substr(nPos, strTemp.size() - nPos);
}

inline void ParseUrl(LPCSTR lpUrl, string& strHostName, string& strPage, WORD& sPort)
{
	sPort = 80;
	string strTemp(lpUrl);
	int nPos = strTemp.find("http://");
	if (string::npos != nPos)
		strTemp = strTemp.substr(nPos + 7, strTemp.size() - nPos - 7);
	else
	{
		nPos = strTemp.find("https://");
		if (wstring::npos != nPos)
		{
			sPort = 443;//INTERNET_DEFAULT_HTTPS_PORT;
			strTemp = strTemp.substr(nPos + 8, strTemp.size() - nPos - 8);
		}
	}
	nPos = strTemp.find('/');
	if (string::npos == nPos)
		strHostName = strTemp;
	else
		strHostName = strTemp.substr(0, nPos);
	int nPos1 = strHostName.find(':');
	if (nPos1 != string::npos)
	{
		string strPort = strTemp.substr(nPos1 + 1, strHostName.size() - nPos1 - 1);
		strHostName = strHostName.substr(0, nPos1);
		sPort = (WORD)atoi(strPort.c_str());
	}
	if (string::npos == nPos) {
		strPage = '/';
		return;
	}
	strPage = strTemp.substr(nPos, strTemp.size() - nPos);
}

inline string U2A(const wstring& str)
{
	string strDes="";
	if (str.empty())
	    return strDes;
	int nLen = ::WideCharToMultiByte(CP_ACP, 0, str.c_str(), str.size(), NULL, 0, NULL, NULL);
	if (0 == nLen)
		return strDes;
	char* pBuffer = new char[nLen + 1];
	memset(pBuffer, 0, nLen + 1);
	::WideCharToMultiByte(CP_ACP, 0, str.c_str(), str.size(), pBuffer, nLen, NULL, NULL);
	pBuffer[nLen] = '\0';
	strDes.append(pBuffer);
	delete[] pBuffer;
	return strDes;
}

inline wstring A2U(const string& str)
{
	wstring strDes=L"";
	if (str.empty())
		return strDes;
	int nLen = ::MultiByteToWideChar(CP_ACP, 0, str.c_str(), str.size(), NULL, 0);
	if (0 == nLen)
		return strDes;
	wchar_t* pBuffer = new wchar_t[nLen + 1];
	memset(pBuffer, 0, nLen + 1);
	::MultiByteToWideChar(CP_ACP, 0, str.c_str(), str.size(), pBuffer, nLen);
	pBuffer[nLen] = '\0';
	strDes.append(pBuffer);
	delete[] pBuffer;
	return strDes;
}

inline wstring Utf2U(const string& strUtf8)
{
	wstring wstrRet(L"");
	int nLen = MultiByteToWideChar(CP_UTF8, 0, strUtf8.c_str(), -1, NULL, 0);
	if (nLen == ERROR_NO_UNICODE_TRANSLATION)
		throw "Invalid UTF-8 string!";
	wstrRet.resize(nLen + 1, '\0');
	MultiByteToWideChar(CP_UTF8, 0, strUtf8.c_str(), -1, (LPWSTR)wstrRet.c_str(), nLen);
	return wstrRet;
}

inline bool FileExist(LPCSTR lpFile)
{
	HANDLE hFile = CreateFileA(lpFile, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	if (hFile == INVALID_HANDLE_VALUE)
		return false;
	CloseHandle(hFile);
	return true;
}

inline bool FileExistW(LPCWSTR lpFile)
{
	HANDLE hFile = CreateFileW(lpFile, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
	if (hFile == INVALID_HANDLE_VALUE)
		return false;
	CloseHandle(hFile);
	return true;
}

inline bool isEmptyString(LPCSTR lpStr)
{
	if (NULL == lpStr || strlen(lpStr) == 0) {
		return true;
	}
	return false;
}

