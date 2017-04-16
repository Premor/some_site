#!/bin/sh
cd /home/www/git_visage/some_site/
git checkout backend
cp -r -f /home/www/git_visage/some_site/* /home/www/visage_school
git checkout frontend
cp -r -f /home/www/git_visage/some_site/* /home/www/visage_school
cd /home/www/visage_school/
gcc -o daemon daemon.c
./daemon