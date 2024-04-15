# birthday-dashboard

Present upcoming birthdays in an HTML dashboard page

## Build

```bash
git clone http://gitlab.esl.corp.elbit.co.il/DP99662/birthdays-page.git
cd birthdays-page
npm install
```



## Run

```bash
cd birthdays-page
npm run dev


# Expected output
#
#  VITE v4.5.2  ready in 376 ms
#
#  ➜  Local:   http://localhost:4123/
#  ➜  Network: http://10.110.13.153:4123/
#  ➜  press h to show help
#
```

## Docker

* <u>Build Image</u>

  ```bash
  cd birthdays-page
  ./build_docker_image.sh --no-cache
  ```

* <u>Run Image</u>

  ```bash
  docker run -d --name birthdays-page -p 4123:4123 -e BIRTHDAYS_SERVER_HOST="0.0.0.0" -e BIRTHDAYS_SERVER_PORT=4123 artifactory.esl.corp.elbit.co.il/aerospace-simulators-devops-docker/birthdays-page-nodejs:14
  
  # Expected container output:
  # 
  # Executing: npm run dev
  # 
  # > birthday-dashboard@0.0.0 dev /app
  # > vite
  # 
  # 
  #   VITE v4.5.2  ready in 549 ms
  # 
  #   ➜  Local:   http://localhost:4123/
  #   ➜  Network: http://172.17.0.3:4123/
  # 
  ```

  
