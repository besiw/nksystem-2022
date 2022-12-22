
import Typography from '@mui/material/Typography';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import LoginForm from './LoginForm'
import NBKLogo from 'app/shared-components/Logo';
/**
 * Form Validation Schema
 */


function ClassicSignInPage() {


  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
            <div className="flex items-center justify-center"  style={{"margin":"-5rem"}}>
									<NBKLogo customSize="24" />
							</div>

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Logg på NKS Admin
          </Typography>
          <LoginForm/>

        </div>
      </Paper>
    </div>
  );
}

export default ClassicSignInPage;
