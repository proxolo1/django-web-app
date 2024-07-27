import { useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';
import FileList from './fileList';
import UploadPAFile from './uploadPAFile';
import { PAFileHeaders } from '../utils/constants';

const Private = () => {
    const [fileList, setFileList] = useState([]);
    const [listError, setListError] = useState('');
    const [deleteFileError, setDeleteFileError] = useState('');
    const [samplesPerFrequency, setSamplesPerFrequency] = useState(0);
    const [calculationError, setCalculationError] = useState('');
    const [heartrate, setHeartrate] = useState('');
    const api = useAxios();

    // this function is to refresh the file list
    const fetchData = async () => {
        try {
            // TODO: Set the URL from the backend to get all files
            const response = await api.get('http://127.0.0.1:8000/api/getPAFiles/');
            setFileList(response.data.files)
        } catch (error) {
            setListError(error.response.data.error.toString());
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetError = () => {
        setDeleteFileError('');
        setCalculationError('');
    };

    const resetHeartrate = () => {
        setHeartrate('');
    };

    // this function is to calculate the heartrate
    const calculateHeartrate = (file) => {
        resetError();
        if (samplesPerFrequency > 0) {
            // TODO: Set the URL to calculatethe heart rate with the file id and sample per frequency in the post request data
            api.post('http://127.0.0.1:8000/api/calculateHeartrate/', { 
                file_id: file.id,
                sampling_frequency: samplesPerFrequency
            })
                .then(response => {
                    setCalculationError('');
                    // TODO: Set the heartrate with the file name to the const heartrate
                    setHeartrate(`Heart rate for ${file.file_name}: ${response.data.heartrate}`)

                })
                .catch((error) => {
                    setCalculationError(error.response.data.error.toString());
                    resetHeartrate();
                });
        } else {
            setCalculationError('Set value for samples per frequency that is higher than 0!')
            resetHeartrate();
        }
    };

    const handleSetSampleFrequancy = (e) => {
        e.preventDefault();
        
        // TODO: Convert the value from the input for the sample frequancy to number an set it to samplePerFrequency
        const strNumber = e.target.value;
        setSamplesPerFrequency(Number(strNumber));
    };

    // This function is to delet a file
    const deleteFile = (file) => {
        resetHeartrate();
        // TODO: Set the URL to delete a file with the file id in the post request data
        api.post('http://127.0.0.1:8000/api/deletePAFile/', {
            file_id: file.id
         })
            .then(() => {
                setDeleteFileError('');
                // TODO: refresh the file list
                fetchData();
            })
            .catch((error) => {
                setDeleteFileError(error.response.data.error.toString())
            });
    }
    
    return (
        <section>
            <h1>Private</h1>
            {listError ? 
                <p className='error-message'>{listError}</p> :
                <div>
                    {/* TODO: Give the component the Name from the list, the files to show, PAFileHeader for the dynamic build from the table,
                    calculateHeartrate for the onAction button and deleteFile for the onDelte button */}
                    <FileList 
                        listName="User Files"
                        files={fileList}
                        headers={PAFileHeaders}
                        onAction={calculateHeartrate}
                        onDelete={deleteFile}
                    />
                    {deleteFileError && <p className='error-message'>{deleteFileError}</p>}
                    <div>
                        <label htmlFor='samplePerFrequency'>Samples per frequency</label>
                        <input
                            type='text'
                            id='samplePerFrequency'
                            name='samplePerFrequency'
                            value={samplesPerFrequency}
                            onChange={(e) => handleSetSampleFrequancy(e)}
                        />
                        {calculationError && <p className='error-message'>{calculationError}</p>}
                        {heartrate && <p>{heartrate}</p>}
            </div>
                </div>
                
            }
            {/* TODO: Give the finction 'fetchData' to ths component for the refreshFileList argument */}
            <UploadPAFile 
                refreshFileList={fetchData}
            />
        </section>
    );
};

export default Private;