import{ Router }from'express';
import User from'../model/user';
import{ catchAsync }from'../middlewares';
// import { validate, resendEmailSchema, verifyEmailSchema } from "../validation";
import{ sendMail }from'../mail';
import{ BadRequest }from'../errors';
import{ markAsVerified }from'../auth';

const router = Router();

router.post(
  '/verify',
  catchAsync(async (req, res) => {
    // await validate(verifyEmailSchema, req.query);

    const { id } = req.query;

    const user = await User.findById(id).select('verifiedAt');

    if(!user || !User.hasValidVerificationUrl(req.originalUrl, req.query)){
      console.log(`Invalid Url: ${req.originalUrl}`)
      throw new BadRequest('Invalid activation link');
    }

    if(user.verifiedAt){
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

    const user = await User.findOne({ email }).select('email verifiedAt');

    if(user && !user.verifiedAt){
      const link = user.verificationUrl();

      await sendMail({
        to: email,
        subject: 'Verify your email address',
        text: link
      });
    }

    res.json({
      message:
        'If your email address needs to be verified, you will receive an email with the activation link'
    });
  })
);
module.exports = router;
// export { router as verify };
