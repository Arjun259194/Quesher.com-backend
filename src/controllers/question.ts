import { getQuestionReqParam, postQuestionReqBody } from '../schemas/question';
import { ReqBodyParseWrapper, ReqParamParseWrapper } from '../utils/wrapper';

export const GetQuestionController = ReqParamParseWrapper(
  getQuestionReqParam,
  async (req, res) => {},
);

export const PostQuestionController = ReqBodyParseWrapper(
  postQuestionReqBody,
  async (req, res) => {
    const userID = res.locals.userId as string;
    // const newQuestion =gcc
  },
);
