// HttpInterface.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include "pch.h"
#include <iostream>
#include "WinNetHttp.h"


bool createInstance(HttpBase** pBase, InterfaceType flag)
{
	HttpBase* pInst = NULL;
	switch (flag)
	{
	case SocketType:
		//pInst = new httpSocket();
		break;
	case winNet:
		pInst = new WinInetHttp();
		break;
	}
	*pBase = pInst;
	return pInst != NULL;
}

bool test() {
	WinInetHttp* pHttp;
	bool bRet = createInstance((HttpBase**)&pHttp, winNet);
	if (!bRet)
	{
		return false;
	}
	char* pMem = NULL;
	int nSize = 0;
	const wchar_t* pUrl = L"https://www.google.com/";
	//you can add your header here
	string str = pHttp->Request(pUrl, httpGet);
	if (str.empty())
	{
		pHttp->FreeInstance();
		return false;
	}
	//test post
	std::string ret = pHttp->Request("https://www.google.com/", httpPost, "{\"name\":\"Bob\",\"address\":\"San Jose\"}");
	std::cout << ret << std::endl;
	pHttp->FreeInstance();
	return true;
}

int main()
{
	std::cout<<test();
}