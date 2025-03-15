export const environment = {
  production: false,
  aws: {
    region: 'us-west-2', // or your preferred region
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    bucketName: process.env['AWS_BUCKET_NAME']
  }
}; 