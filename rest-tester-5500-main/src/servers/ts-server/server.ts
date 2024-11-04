import app from './serverImplementation';

const port = 5001;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});