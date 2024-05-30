import NextErrorComponent from 'next/error';

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    console.error(err);
  }

  return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async ({ res, err, asPath }) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps({
    res,
    err,
  });

  errorInitialProps.hasGetInitialPropsRun = true;

  if (res) {
    if (err) {
      console.error(err);
    } else {
      console.error(`Error occurred while rendering ${asPath}`);
    }
  }

  return errorInitialProps;
};

export default MyError;
