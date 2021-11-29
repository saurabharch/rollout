import{ Router }from'express';
import User from'../model/user';
import{ catchAsync }from'../middlewares';
// import { validate, resendEmailSchema, verifyEmailSchema } from "../validation";
import{ sendMail }from'../mail';
import{ BadRequest }from'../errors';
import{ markAsVerified }from'../auth';
import UserController from'../jobs/controller/UserController';

const router = Router();

router.get(
  '/verify',
  catchAsync(async (req, res) => {
    // await validate(verifyEmailSchema, req.query);

    const { id } = req.query;
    console.log(`${id}`);
    const user = await User.findById(id).select('active');
    console.log(`User Status : ${user}`)
    if(!user || !User.hasValidVerificationUrl(req.originalUrl, req.query)){
      console.log(`Invalid Url: ${req.originalUrl}`)
      throw new BadRequest('Invalid activation link');
    }

    if(user.active == true){
      console.log(`Aleady Verified Url: ${req.originalUrl}`)
      throw new BadRequest('Email already verified');
    }
    

    await markAsVerified(user);
    console.log(`Valid Url is Verified : ${req.originalUrl}`)
    res.json({ message: 'OK' });
  })
);

router.post(
  '/resend',
  catchAsync(async (req, res) => {
    // await validate(resendEmailSchema, req.body);
    const { email } = req.body;

    const user = await User.findOne({ email }).select('email verifiedAt active status');

    console.log(`User verified status : ${user}`)
    if(user.active == true && user.status == 1 && user.verifiedAt){
      const link = user.verificationUrl();

      var Cdata = [];
      Cdata.push({to:email,
      subject:'verify your email address',
      text:link
      });
     UserController.store(Cdata);
      // await sendMail({
      //   to: email,
      //   subject: 'Verify your email address',
      //   text: link
      // });
    }

    res.json({
      message:
        'If your email address needs to be verified, you will receive an email with the activation link'
    });
  })
);
module.exports = router;
// export { router as verify };
