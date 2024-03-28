const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
app.use(bodyParser.json());



let tasks = []; 
function addTask(newTask) {
    tasks.push(newTask);
}

app.post('/maa/getTask', (req, res) => {
    console.log('폴링중입니다', req.body); // 1초마다 폴링
    getTskReq = JSON.stringify(req.body); // 요청을 임시 let에 저장 : 출력 디버깅용
    res.json({ tasks });
  });
  // 작업 상태 보고 엔드포인트
app.post('/maa/reportStatus', (req, res) => {
    console.log('작업 실행 결과:', req.body);
    getReportStatus = JSON.stringify(req.body); // json 2 string 
    res.send('OK');
  });
app.listen(maaPort, () => {
    console.log(`서버가 ${maaPort}번 포트에서 실행중입니다.`);
  });
  
// 연결 테스트
function testMaa() {
    console.log("LinkStart 요청")
    addTask({
    id: userMaaID,
    type: "LinkStart"
  });
  console.log("요청완료")
}
