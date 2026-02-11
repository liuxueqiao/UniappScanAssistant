const tencentcloud = require("tencentcloud-sdk-nodejs");
const { getEnv } = require("../config/env");

async function getStsCredential(req, res, next) {
  try {
    const env = getEnv();

    if (!env.COS_SECRET_ID || !env.COS_SECRET_KEY || !env.COS_REGION || !env.COS_BUCKET) {
      return res.status(500).json({
        error: { code: "COS_NOT_CONFIGURED", message: "COS env not configured" }
      });
    }

    const StsClient = tencentcloud.sts.v20180813.Client;
    const client = new StsClient({
      credential: { secretId: env.COS_SECRET_ID, secretKey: env.COS_SECRET_KEY },
      region: env.COS_REGION,
      profile: { httpProfile: { endpoint: "sts.tencentcloudapi.com" } }
    });

    const policy = {
      version: "2.0",
      statement: [
        {
          action: ["name/cos:PutObject", "name/cos:InitiateMultipartUpload", "name/cos:UploadPart", "name/cos:CompleteMultipartUpload", "name/cos:AbortMultipartUpload", "name/cos:HeadObject", "name/cos:GetObject"],
          effect: "allow",
          resource: [
            `qcs::cos:${env.COS_REGION}:uid/*:${env.COS_BUCKET}/${env.COS_ALLOW_PREFIX}`
          ]
        }
      ]
    };

    const resp = await client.GetFederationToken({
      Name: `u_${req.user.id}`,
      DurationSeconds: 1800,
      Policy: JSON.stringify(policy)
    });

    return res.json({
      credentials: resp.Credentials,
      expiredTime: resp.ExpiredTime,
      region: env.COS_REGION,
      bucket: env.COS_BUCKET,
      allowPrefix: env.COS_ALLOW_PREFIX
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getStsCredential };

