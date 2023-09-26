const config = {};

config.serviceName = 'auth';

config.debug = process.env.NODE_DEBUG === 'true';

config.PORT = +process.env.PORT || 8001;

config.logger = {
    level: 'debug',
};

config.authAPI = {
    root: 'api',
    version: 'v1',
    url: 'auth',
    getUrl: function() { return `/${this.root}/${this.version}/${this.url}` },
};

config.aws = {
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsAccessSecret: process.env.AWS_ACCCESS_KEY_SECRET,
    awsRegion: process.env.AWS_REGION,
};

config.aws.cloudwatch = {
    awsAccessKey: process.env.AWS_CLOUDWATCH_ACCESS_KEY_ID,
    awsAccessSecret: process.env.AWS_CLOUDWATCH_ACCESS_KEY_SECRET,
    awsRegion: process.env.AWS_CLOUDWATCH_REGION,
    awsLogGroupName: process.env.AWS_CLOUDWATCH_LOGS_GROUPNAME,
    awsLogsStreamName: process.env.AWS_CLOUDWATCH_LOGS_STREAM,
};

config.db = {
    mongo: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        host: process.env.MONGODB_HOST,
        dbName: process.env.MONGODB_DB_NAME,
        getURI() {
            return `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.dbName}?retryWrites=true`
        }
    }
};

config.SALT_WORK_FACTOR = 10;

config.jwt = {
    options: {
        algorithm: 'RS256',
        expiresIn: '7m',
        issuer: 'auth-service',
    },
};

config.fb = {
    appId: process.env.FACEBOOK_APP_ID,
    secretToken: process.env.FACEBOOK_SECRET_TOKEN,
};

module.exports = config;
