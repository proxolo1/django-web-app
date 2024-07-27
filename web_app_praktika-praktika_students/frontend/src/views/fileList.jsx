import '../styles/fileList.css'
import { useState } from 'react';

function FileList({ listName, files, headers, onAction, onDelete }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectError, setSelectError] = useState('');

    const resetError = () => {
        setSelectError('');
    };

    const resetSelectedFile = () => {
        setSelectedFile(null);
    }

    const handleSelect = (file) => {
        if (file === selectedFile) {
            resetSelectedFile();
        } else {
            setSelectedFile(file);
        };  
    };

    const handleOnAction = () => {
        if (selectedFile) {
            resetError();
            // TODO: Call the onAction function
            onAction(selectedFile); 
        } else {
            // TODO: Set an error when no file is selected
            setSelectError('No file selected. Please select a file to proceed.');
        }
    };

    const handleOnDelete = () => {
        if (selectedFile) {
            resetError();
            const confirm = window.confirm(
                'Do you really want to delete the file "' + selectedFile.file_name + '"?'
            )

            if (confirm) {
                // TODO: Call the onDelete function
                onDelete(selectedFile);
                resetSelectedFile()
            };
        } else {
            // TODO: Set an error when no file is selected
            setSelectError('No file selected. Please select a file to delete.')
        };
    };

    return (
        <div>
            <h2>{listName}</h2>
            <table className='file-list'>
                <thead>
                    <tr>
                        {Object.keys(headers).map((key) => (
                            <th key={headers[key]}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr
                            key={index}
                            onClick={() => handleSelect(file)}
                            className={selectedFile === file ? 'file-list-selected' : ''}
                        >
                            {Object.keys(headers).map((key) => (
                                <td key={headers[key]}>{file[headers[key]]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectError && <p className='error-message'>{selectError}</p>}
            <button className='button' onClick={handleOnAction}>Calculate</button>
            <button className='button delete-button' onClick={handleOnDelete}>Delete File</button>
        </div>
    );
}

export default FileList;