const aws_cognito = require('amazon-cognito-identity-js');
var user_pool = new aws_cognito.CognitoUserPool({
  UserPoolId: 'AWS Cognitoで作ったユーザープールのプールID',
  ClientId: 'AWS Cognitoで作ったアプリクライアントID'
});
const cognito_user = new aws_cognito.CognitoUser({
  Username: 'ユーザー名',
  Pool: user_pool,
});
const authentication_details = new aws_cognito.AuthenticationDetails({
  Password: 'パスワード',
});
cognito_user.authenticateUser(authentication_details, {
  onSuccess(result) {
    console.log(result.getAccessToken().getJwtToken());
  },
  onFailure(err) {
    console.error(err);
  },
  // ####################################################################################
  // 初回認証時はパスワードの変更が要求されるので、仮パスワードと同じパスワードを再設定する
  newPasswordRequired(user_attributes, required_attributes) {
    cognito_user.completeNewPasswordChallenge(authentication_details.password, user_attributes, this);
  },
});

