class RuvexiApiConfig {
  static const String apiBaseUrl = String.fromEnvironment(
    'RUVEXI_API_URL',
    defaultValue: 'https://api.ruvexisolutions.com/api/v1',
  );

  static const String webAppUrl = String.fromEnvironment(
    'RUVEXI_WEB_URL',
    defaultValue: 'https://ruvexi.netlify.app',
  );

  // Default to the official Google OAuth Client ID
  static const String googleClientId = String.fromEnvironment(
    'GOOGLE_CLIENT_ID',
    defaultValue: '688082902607-cuotmpb605mn5i7jkjv6ojql16bkmdml.apps.googleusercontent.com',
  );
}
