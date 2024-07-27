import '/src/styles/InfoUser.css'
import { useEffect, useState } from 'react';
import useAxios from '../utils/useAxios';

const InfoUserComponent = () => {
    const [info, setInfo] = useState({});
    const [errorInfo, setErrorInfo] = useState(null);
    const [editInfo, setEditInfo] = useState(false);
    const [newInfo, setNewInfo] = useState({});
    const api = useAxios();

    const fetchData = async () => {
        try {
            // TODO: Set here the adress to get the user information with a get request
            const response = await api.get('http://127.0.0.1:8000/api/getUserInfo/');
            // TODO: Set the data from the response to the info state
            setInfo(response.data);
            resetState();
            setErrorInfo(null);
        } catch (error) {
            setErrorInfo(error.response.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditMode = () => {
        setErrorInfo(null);
        // TODO: toggle the editInfo state
        setEditInfo(!editInfo)
        resetState();
    };

    const resetState = () => {
        setNewInfo({
            email: info.email,
            first_name: info.first_name,
            last_name: info.last_name,
        });
    }

    const handleSaveInfo = async () => {
        let sendInfo = {}
        // TODO: Check if info.email is the same as newInfo.email. If not set newInfo.email to sendInfo.email
        if (info.email !== newInfo.email) {
            sendInfo.email = newInfo.email
        }
        // TODO: Check if info.first_name is the same as newInfo.first_name. If not set newInfo.first_name to sendInfo.first_name
        if (info.first_name !== newInfo.first_name) {
            sendInfo.first_name = newInfo.first_name
        }
        // TODO: Check if info.last_name is the same as newInfo.last_name. If not set newInfo.last_name to sendInfo.last_name
        if (info.last_name !== newInfo.last_name) {
            sendInfo.last_name = newInfo.last_name
        }

        // TODO: Check if the lenght of keys from sendInfo is higher then 0
        if (Object.keys(sendInfo).length > 0) {
            // TODO: Set here the adress to get the user information with a post request and sendInfo as the data from the post request
            api.put('http://127.0.0.1:8000/api/setUserInfo/', sendInfo)
                .then(() => {
                    fetchData();
                })
                .catch((error) => {
                    setErrorInfo(error.response.data);
                });
        } else {
            setErrorInfo('There are no changes!')
        }
        resetState();
        setEditInfo(false);
    };

    const handleChange = (name, value) => {
        setNewInfo({...newInfo, [name]: value})
    };

    const editableRow = (rowName, name, value ) => {
        return (
            <tr>
                <td className='info-user-name-cell'><strong>{rowName}</strong></td>
                <td>
                    {editInfo ? (
                        <input
                            type='text'
                            name={name}
                            value={newInfo[name]}
                            onChange={(e) => handleChange(name, e.target.value)}
                            className={info[name] !== newInfo[name] ? 'info-user-changed' : ''}
                        /> 
                    ) : (value)}
                </td>
            </tr>
        ); 
    };

    return (
        <div>
            <p><strong>User Information</strong></p>
            <table className='info-user'>
                <tbody>
                    <tr>
                        <td className='info-user-name-cell'><strong>Username</strong></td>
                        <td>{info.username}</td>
                    </tr>
                    {editableRow('E-Mail Address', 'email', info.email)}
                    {editableRow('First Name', 'first_name', info.first_name)}
                    {editableRow('Last Name', 'last_name', info.last_name)}
                    <tr>
                        <td className='info-user-name-cell'><strong>Is Superuser</strong>r</td>
                        {/* TODO: If is_superuser is True show 'Yes', else 'No' */}
                        <td>{info.is_superuser ? 'Yes' : 'No'}</td>
                    </tr>
                </tbody>
            </table>
            {editInfo && 
                <button className='button' onClick={handleSaveInfo}>
                    Save
                </button>}
            <button className='button' onClick={handleEditMode}>
                {/* TODO: If editInfo is True the button show 'Cancle', else 'Edit Info' */}
                {editInfo ? 'Cancel' : 'Edit Info'}
            </button>
            {errorInfo && <p className='error-message'>{errorInfo}</p>}
        </div>
    );
};

export default InfoUserComponent;