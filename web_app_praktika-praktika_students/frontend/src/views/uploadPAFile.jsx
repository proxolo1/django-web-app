import { useState } from 'react';
import useAxios from '../utils/useAxios';

const UploadPAFile = ({ refreshFileList }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [errorSelectedFile, setErrorSelectedFile] = useState('');
    const [errorFileName, setErrorFileName] = useState('');
    const [error, setError] = useState('');
    const api = useAxios();

    const resetState = () => {
        setSelectedFile(null);
        setFileName('');
        document.getElementById('fileInput').value = '';
    };

    const resetErrors = () => {
        setError('');
    };

    const handleFileChange = (e) => {
        // TODO: Set here the file from the event
        setSelectedFile(e.target.files[0]);
    };

    const handleFileNameChange = (e) => {
        // TODO: Set here the file name from the event
        setFileName(e.target.value);
    };

    const handleFileUpload = (e) => {
        resetErrors();
        e.preventDefault();
        const formData = new FormData();
        // TODO: Append the selected file to formData
        formData.append('file', selectedFile);
        // TODO: Append the file name to fromData
        formData.append('file_name', fileName);

        // TODO: Enter the url to upload the file
        api.post('http://127.0.0.1:8000/api/uploadPAFile/', formData)
            .then(() => {
                resetState();
                // TODO: Call the function to refresh the file list
                refreshFileList();
            })
            .catch((error) => {
                const errorMessages = error.response.data;
                
                if ('file' in errorMessages) {
                    setErrorSelectedFile(errorMessages.file.toString());
                };

                if ('file_name' in errorMessages) {
                    setErrorFileName(errorMessages.file_name.toString());
                };

                if ('error' in errorMessages) {
                    setError(errorMessages.error.toString());
                };
                
            });
    };
    return (
        <section>
            <form onSubmit={handleFileUpload}>
                <div>
                    <label htmlFor='fileInput'>Select file:</label>
                    <input
                        type='file'
                        id='fileInput'
                        accept='.csv'
                        onChange={handleFileChange}    
                        required
                    />
                </div>
                {/* TODO: Show the error when something went wrong by the file upload with the file */}
                {errorSelectedFile && <p>{errorSelectedFile}</p>}
                <div>
                    <label htmlFor='fileNameInput'>File Name:</label>
                    <input 
                        type='text'
                        id='FileNameInput'
                        value={fileName}
                        onChange={handleFileNameChange}
                        placeholder='Enter file name'
                        required
                    />
                </div>
                {/* TODO: Show the error when something went wrong by the file upload with the file name */}
                {errorFileName && <p>{errorFileName}</p>}
                <button className='button' type='submit'>Upload File</button>
            </form>
            {error && <p className='error-message'>{error}</p>}
        </section>
    );
};

export default UploadPAFile;