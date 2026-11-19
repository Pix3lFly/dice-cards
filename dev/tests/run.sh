#!/bin/bash
# start the shared mock server, run a test script, stop the server
pkill -f server.py 2>/dev/null; sleep .3
python3 /home/claude/t/server.py >/tmp/srv.log 2>&1 &
SP=$!; sleep 1
python3 "$@" 2>&1 | grep -v -i "proxy\|connect_rej\|allowed dom\|for details"
kill $SP 2>/dev/null
