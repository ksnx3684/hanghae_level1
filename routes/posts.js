const express = require("express");
const router = express.Router();
const ObjectId = require("mongodb").ObjectId;


// 게시글 작성 API
const Posts = require('../schemas/posts.js');
router.post('/posts/', async (req, res) => {

    const {user, password, title, content} = req.body;
    
    if( // 필수 데이터가 하나라도 누락되어 있다면
        !user ||
        !password ||
        !title ||
        !content
    ){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    };

    const createdAt = new Date();

    const datas = await Posts.create({user, password, title, content, createdAt});

    res.json({ message : "게시글을 생성하였습니다." });

});


// 게시글 조회 API
router.get('/posts/', async (req, res) => {

    const posts = await Posts.find({});

    const results = posts.map((data) => {
        return {  
            postId: data._id,
            user: data.user,
            title: data.title,
            createdAt : data.createdAt   
        };
    });

    res.status(200).json({ data: results });

});


// 게시글 상세 조회 API
router.get('/posts/:_postId', async (req, res) => {

    const {_postId} = req.params;
    let underId = _postId;
    
    if(underId.length !== 24){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    try{
        const post = await Posts.find({_id: new ObjectId(underId)});

        const results = post.map((data) => {
            return {
                postId: data._id,
                user: data.user,
                title: data.title,
                content: data.content,
                createdAt : data.createdAt
            };
        });
    } catch(err){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }
    
    res.status(200).json({ data: results });

});


// 게시글 수정 API
router.put('/posts/:_postId', async(req, res) => {

    const {_postId} = req.params;
    let underId = _postId;

    const {password, title, content} = req.body;

    if(
        underId.length !== 24 ||
        !password ||
        !title ||
        !content
    ){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    try{
        const post = await Posts.find({_id: new ObjectId(underId)});

        if(!post.length){
            return res.status(404).json({
                message: "게시글 조회에 실패하였습니다."
            });
        } else {
            // await Posts.updateOne({
            //     password: password,
            //     title: title,
            //     content: content
            // })
            await Posts.updateOne(
                {_id: new ObjectId(underId), password: password},
                {$set: {title: title, content: content}}
            )
        }
    } catch(err){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }
    
    res.status(200).json({message: "게시글을 수정하였습니다."});

});


// 게시글 삭제 API
router.delete('/posts/:_postId', async(req, res) => {

    const {_postId} = req.params;
    let underId = _postId;

    let {password} = req.body;

    if(
        underId.length !== 24 ||
        !password
    ){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    try{
        const posts = await Posts.findOne({_id: new ObjectId(underId)});
        // console.log(posts);
        // console.log(typeof posts.password);
        // console.log(typeof password);
        // const post = JSON.parse(JSON.stringify(posts));
        // console.log(post);

        if(posts === null){
            return res.status(404).json({
                message: "게시글 조회에 실패하였습니다."
            });
        } else {
            const post = JSON.parse(JSON.stringify(posts));
            password = password.toString();

            if(post.password === password){
                await Posts.deleteOne({_id: new ObjectId(underId)});
                await Comments.deleteMany({_postId: new ObjectId(underId)});
                return res.status(200).json({
                    message: "게시글을 삭제하였습니다."
                })
            } else {
                return res.status(400).json({
                    message: "비밀번호가 일치하지 않습니다."
                })
            }        
        }
    } catch(err){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

});


// 댓글 생성 API
const Comments = require('../schemas/comments.js');
router.post('/posts/:_postId/comments', async (req, res) => {

    const {_postId} = req.params;

    try{
        let check = new ObjectId(_postId); // ObjectId 형식 검사
        let underId = check.toString();
        const {user, password, content} = req.body;

        if(
            underId.length !== 24 ||
            !user ||
            !password
        ){
            return res.status(400).json({
                message: "데이터 형식이 올바르지 않습니다."
            });
        }

        if(!content){
            return res.status(400).json({
                message: "댓글 내용을 입력해주세요."
            })
        }

        const createdAt = new Date();

        await Comments.create({_postId, user, password, content, createdAt});
    }catch(err) {
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    res.json({ message : "댓글을 생성하였습니다." });

});


// 댓글 목록 조회 API
router.get('/posts/:_postId/comments', async (req, res) => {

    const {_postId} = req.params;
    let underId = _postId;

    if(underId.length !== 24){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    try{
        const comments = await Comments.find({_postId: new ObjectId(underId)});

        const results = comments.map((data) => {
            return {  
                commentId: data._id,
                user: data.user,
                content: data.content,
                createdAt : data.createdAt   
            };
        });

        res.status(200).json({ data: results });
    }catch(err) {
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

});


// 댓글 수정 API
router.put('/posts/:_postId/comments/:_commentId', async (req, res) => {

    const {_postId, _commentId} = req.params;
    let underPostId = _postId;
    let underCommentId = _commentId;
    const {password, content} = req.body;

    if(
        underPostId.length !== 24 ||
        underCommentId.length !== 24 ||
        !password
    ){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    if(!content){
        return res.status(400).json({
            message: "댓글 내용을 입력해주세요."
        })
    }

    try{
        const comments = await Comments.find({_postId: new ObjectId(underPostId), _id: new ObjectId(underCommentId)});

        if(!comments.length){
            return res.status(404).json({
                message: "댓글 조회에 실패하였습니다."
            });
        } else {
            await Comments.updateOne(
                {_id: new ObjectId(underCommentId), password: password},
                {$set: {content: content}}
            )
        }
    }catch(err) {
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }
    
    res.status(200).json({message: "댓글을 수정하였습니다."});

});


// 댓글 삭제 API
router.delete('/posts/:_postId/comments/:_commentId', async (req, res) => {

    const {_postId, _commentId} = req.params;
    let underPostId = _postId;
    let underCommentId = _commentId;

    let {password} = req.body;

    if(
        underPostId.length !== 24 ||
        underCommentId.length !== 24 ||
        !password
    ){
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }

    try{
        const comments = await Comments.findOne({_postId: new ObjectId(underPostId), _id: new ObjectId(underCommentId)});

        if(comments === null){
            return res.status(404).json({
                message: "댓글 조회에 실패하였습니다."
            });
        } else {
            const comment = JSON.parse(JSON.stringify(comments));
            password = password.toString();
    
            if(comment.password === password){
                await Comments.deleteOne({_id: new ObjectId(underCommentId)});
                return res.status(200).json({
                    message: "댓글을 삭제하였습니다."
                })
            } else {
                return res.status(400).json({
                    message: "비밀번호가 일치하지 않습니다."
                })
            }        
        }
    }catch(err) {
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    }
    
});

module.exports = router;