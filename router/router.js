const mysql = require('mysql');
const con = mysql.createConnection(require('../config/dbconfig.js'));

con.connect((err) => {
	if(err){
		console.log(err);
		return;
	} else{
		console.log('mysql is connected');
	}
})

module.exports = (app,fs) =>{

	app.get('/',(req,res) =>{
		const sql = 'SELECT * FROM board order by date desc';
		con.query(sql,(err,results) =>{
			var subject = new Array();
			var idx = new Array();
			for (var i=0;i<results.length;i++){
				subject[i] = results[i]['subject'];
				idx[i] = results[i]['idx'];
			}
			res.render("index",{
				title:"메인 페이지",
				subject: subject,
				idx: idx,
				length:results.length,
			})
		})
	})

	app.get('/view/:idx',(req,res) =>{
		var idx = req.params.idx;
		const sql = 'SELECT * FROM board where idx="'+idx+'"';
		con.query(sql,(err,results) =>{
			res.render("view",{
				title:"글 보기 페이지",
				writer:results[0]['writer'],
				subject:results[0]['subject'],
				content:results[0]['content'],
				date:results[0]['date'],
			})
		})
	})

	app.get('/login',(req,res) =>{
		res.render("login",{
			title:"로그인 페이지",
		})
	})

	app.get('/join',(req,res) =>{
		res.render("join",{
			title:"회원가입 페이지"
		})
	})

	app.post('/join',(req,res) =>{
		const mb_id = req.body.mb_id;
		const mb_pw = req.body.mb_pw;
		const mb_name = req.body.mb_name;
		const sql = 'SELECT count(*) FROM member where id="'+mb_id+'"';
		con.query(sql , (err,results,field) => {
			if (results[0]['count(*)'] > 0){
				res.send('<script>alert("중복된 아이디 입니다.");</script>');
				return false;
			} else{
				const ins = 'INSERT INTO member SET id="'+mb_id+'",pw="'+mb_pw+'", name="'+mb_name+'"';
				con.query(ins,(err,results,field) => {
					res.send('<script>alert("회원가입이 완료되었습니다.");</script>');
				})
			}
		})
	})

	app.post('/login',(req,res) =>{
		const mb_id = req.body.mb_id;
		const mb_pw = req.body.mb_pw;
		const sql = 'SELECT * FROM member where id="'+mb_id+'" and pw="'+mb_pw+'"';
		con.query(sql, (err,results,field) => {
			if (results[0] == undefined) {
				res.send('<script>alert("아이디 또는 비밀번호가 일치하지 않습니다.");</script>');
				return false;
			} else{
				// var sess = results[0]['name'];
				sess = req.body;
				sess.username = results[0]['name'];
				res.send('<script>alert("로그인 되었습니다.");</script>');
			}
		})
	})

	app.get('/write',(req,res) =>{
		res.render('write',{
			title:"글작성"
		})
	})

	app.post('/write',(req,res)=>{
		const writer = req.body.writer;
		const subject = req.body.subject;
		const content = req.body.content;
		const sql = 'INSERT INTO board set writer="'+writer+'",subject="'+subject+'",content="'+content+'",date=now()';
		con.query(sql,(err,results)=>{
			res.send('<script>alert("완료되었습니다.");</script>');
		})
	})

}