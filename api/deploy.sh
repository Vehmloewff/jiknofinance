rsync -avzh . root@api.finance.jikno.com:/root/server

ssh root@api.finance.jikno.com ". ~/.nvm/nvm.sh && pm2 restart server"