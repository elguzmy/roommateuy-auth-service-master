const { createLogger, format, transports } = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');

const config = require('../config');

const NODE_ENV = process.env.NODE_ENV || 'development';
const {
    combine,
    timestamp,
    label,
    printf,
} = format;

const formatter = printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

const logger = createLogger({
    format: combine(
        label({ label: NODE_ENV }),
        timestamp(),
        formatter,
    ),
    transports: [new transports.Console()],
});

logger.level = config.logger.level || 'debug';

// AWS CloudWatch

// const loggerConfig = {
//     logGroupName: config.aws.cloudwatch.awsLogGroupName,
//     logStreamName: config.aws.cloudwatch.awsLogsStreamName,
//     createLogGroup: false,
//     createLogStream: false,
//     jsonMessage: true,
//     awsConfig: {
//         accessKeyId: config.aws.cloudwatch.awsAccessKey,
//         secretAccessKey: config.aws.cloudwatch.awsAccessSecret,
//         region: config.aws.cloudwatch.region,
//     },
//     messageFormatter: log => `[${log.level}]:${log.msg} ${JSON.stringify(log.meta)}`,
// };
//
// if (NODE_ENV !== 'development') {
//     logger.add(CloudWatchTransport, loggerConfig);
// }
//
// logger.stream = {
//     write: (message) => {
//         logger.info(message);
//     },
// };

module.exports = logger;
