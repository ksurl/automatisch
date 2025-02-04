import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import useAuthentication from 'hooks/useAuthentication';
import * as URLS from 'config/urls';
import { LOGIN } from 'graphql/mutations/login';
import Form from 'components/Form';
import TextField from 'components/TextField';

function renderFields(props: { loading: boolean }) {
  const { loading = false } = props;

  return () => {
    return (
      <>
        <TextField
          label="Email"
          name="email"
          required
          fullWidth
          margin="dense"
          autoComplete="username"
          data-test="email-text-field"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          margin="dense"
          autoComplete="current-password"
          data-test="password-text-field"
        />

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2, mt: 3 }}
          loading={loading}
          fullWidth
          data-test="login-button"
        >
          Login
        </LoadingButton>
      </>
    );
  };
}

function LoginForm() {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const [login, { loading }] = useMutation(LOGIN);

  React.useEffect(() => {
    if (authentication.isAuthenticated) {
      navigate(URLS.DASHBOARD);
    }
  }, [authentication.isAuthenticated]);

  const handleSubmit = async (values: any) => {
    const { data } = await login({
      variables: {
        input: values,
      },
    });

    const { token } = data.login;

    authentication.updateToken(token);
  };

  const render = React.useMemo(() => renderFields({ loading }), [loading]);

  return (
    <Paper sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.text.disabled,
          pb: 2,
          mb: 2,
        }}
        gutterBottom
      >
        Login
      </Typography>

      <Form onSubmit={handleSubmit} render={render} />
    </Paper>
  );
}

export default LoginForm;
