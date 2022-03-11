const router = require('express').Router();
const bodyParser= require('body-parser');
const bcrypt = require('bcryptjs')
const {check,validationResult } = require('express-validator');
const User = require('./../models/user');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.all('/',function(req,res){
    return res.send("hello user");
})

router.post('/createNew',[
 check('username').not().isEmpty().trim().escape(),
 check('email').isEmail().normalizeEmail(),
 check('password').not().isEmpty().trim().escape()

],
 function (req,res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status:false,
            message: "form validate error",
            errors: errors.array()
        });
    }
   
    const hashedPassword= bcrypt.hashSync(req.body.password,10);

    User.create(
   {
       username:req.body.username,
       email: req.body.email,
       password:hashedPassword

   },
    function(error, result){
        if(error){
            return res.json({
                status: false,
                msg: 'DB insert fail..',
                error:error
            });
        }
        return res.json({
            status: true,
            msg: 'DB insert success..',
            result:result
        });
    }
    );

   
 }
);

router.get(
    '/find/:email',
    function(req,res){
        User.find({email:req.params.email},{password:0},function(error,result){
            if(error){
                return res.json({
                    status: false,
                    msg: 'DB find fail..',
                    error:error
                });
            }
            return res.json({
                status: true,
                msg: 'DB find success..',
                result:result
            });

        });
    }

)

router.put(
    '/update/:email',
    function(req,res){
        if (req.params.email){
        User.findOneAndUpdate(
          {
              email:req.params.email
          },
          {username:'Mahi Vij'},
          function(error,result){
            if(error){
                return res.json({
                    status: false,
                    msg: 'DB Update fail..',
                    error:error
                });
            }
            return res.json({
                status: true,
                msg: 'DB Update success..',
                result:result
            });
 
          }
        );
    }
    else{
        return res.json({
            status:false,
            message:"Provide email "
        })
    }
    });

router.delete('/delete/:email', function(req,res){
    if (req.params.email){
        User.remove({
           email:req.params.email 
        },
        function(error,result){
            if(error){
                return res.json({
                    status: false,
                    msg: 'DB Delete fail..',
                    error:error
                });
            }
            return res.json({
                status: true,
                msg: 'DB Delete success..',
                result:result
            });
        }
        );
    }
    else{
        return res.json({
            status:false,
            message:"provide email id"
        })
    }
})

router.get('/search_user',(req,res,next)=>{
      const searchFeild= req.query.email;
      User.find({email :{$regex:searchFeild,$options:'$i'}})
      .then(data=>{
          res.send(data);
      })
})


module.exports = router;
