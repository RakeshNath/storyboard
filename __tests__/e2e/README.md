# E2E Test Credentials

## Test User Credentials

The following credentials are **ONLY** valid in test environments:

- **Email**: `test@storyboard.test`
- **Password**: `testpassword123`
- **Name**: `Test User`
- **Theme**: `minimalist`

## Security

⚠️ **IMPORTANT**: These credentials are hardcoded and will **NOT** work in production or development environments unless explicitly configured for testing.

### Environment Detection

The login component checks for test environment using:
- `process.env.NODE_ENV === 'test'`
- `process.env.NEXT_PUBLIC_APP_ENV === 'test'`

### Security Measures

1. **Environment Validation**: Test credentials are rejected in non-test environments
2. **Alert Warning**: Users attempting to use test credentials in production will see an alert
3. **No Authentication**: Test credentials will not authenticate in production

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run only login E2E tests
npm run test:login-e2e

# Run E2E tests in watch mode
npm run test:e2e:watch

# Run all tests including E2E
npm run test:all-with-e2e
```

## Test Scenarios

The E2E tests cover:

1. **Successful Login**: Test credentials work in test environment
2. **Security Validation**: Test credentials rejected in production
3. **Regular Login**: Normal credentials work in any environment
4. **Loading States**: Proper UI feedback during authentication
5. **Form Validation**: Required field validation
6. **Data Persistence**: User data correctly stored in localStorage
7. **Error Handling**: Graceful handling of localStorage errors

## Environment Setup

E2E tests automatically set:
- `NODE_ENV=test`
- `NEXT_PUBLIC_APP_ENV=test`

This ensures test credentials are only valid during test execution.
