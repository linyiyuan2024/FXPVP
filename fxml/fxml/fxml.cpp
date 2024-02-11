#include <stdlib.h>
#include <stdio.h>
int main(void)
{
	system("title 复兴对战平台");
	system("powershell ./ui/start.bat");
	system("echo 关闭全部控制台窗口即为关闭对战平台");
	system("pause");
	return 0;
}