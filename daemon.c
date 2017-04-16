#include <stdio.h>
#include <syslog.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
//#include <pthread.h>
void nothing (int sign)
{
	switch(sign){
	case SIGTERM:{
		syslog(LOG_DAEMON,"Поздравляю, вы изгнали демона %d!\n",getpid());
		break;
	}
	case SIGHUP:{
		syslog(LOG_DAEMON,"Не мешай, я работаю...\n");
		break;
	}
}
}

int main(int argc, char const *argv[])
{
	int i;
	i=fork();
	if (i==0){
		setsid();
		umask(0);
		chdir("/home/www/visage_school/new_file");
		signal(SIGILL,nothing);
		signal(SIGHUP,nothing);
		signal(SIGUSR1,nothing);
		signal(SIGTERM,nothing);
		signal(SIGUSR2,nothing);
		freopen("/dev/null","r",stdin);
		freopen("/dev/null","w",stdout);
		freopen("/dev/null","w",stderr);
		system("nodejs app.js");
		openlog("Visage_school",LOG_PID,LOG_DAEMON);
		syslog(LOG_DAEMON,"новый демон %d запущен!\n",getpid());
		}	
	return 0;
}