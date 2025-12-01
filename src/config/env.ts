const apiEnv: ApiEnv = 'prod';

const envMap = {
  dev: {
    apiBaseUrl: 'https://dev-salus.huahill.com/api/',
    ossUrl: 'https://dev-yaoud-pub.oss-cn-shanghai.aliyuncs.com/static/staff',
    ossHost: 'https://dev-yaoud-pub.oss-cn-shanghai.aliyuncs.com',
    aiBaseUrl: 'https://test-ai-agent.huahill.com'
  },
  prod: {
    apiBaseUrl: 'https://api-salus.yaoud.cn/',
    ossUrl: 'https://yaoud-pub.oss-cn-shanghai.aliyuncs.com/static/staff',
    ossHost: 'https://yaoud-pub.oss-cn-shanghai.aliyuncs.com',
    aiBaseUrl: 'https://ai-agent.yaoud.cn'
  }
};

type ApiEnv = keyof typeof envMap;
type Env<T extends ApiEnv> = {
  apiEnv: T;
} & (typeof envMap)[T];

function createEnv(apiEnv: ApiEnv): Env<typeof apiEnv> {
  return Object.assign({ apiEnv }, envMap[apiEnv]);
}

const env = createEnv(apiEnv);
export default env;
