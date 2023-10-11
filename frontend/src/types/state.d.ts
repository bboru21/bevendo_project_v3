interface User {
  first_name: string;
}
interface AuthState {
  user: null|User;
  isAuthenticated: boolean;
  loading: boolean;
  register_success: boolean;
  change_password_success: any;
  change_password_message: any;
  send_password_reset_email_success: any;
  send_password_reset_email_message: any;
  reset_password_success: any;
  reset_password_message: any;
  change_email_success: any;
  change_email_message: any;
}

interface State {
  auth: AuthState;
}