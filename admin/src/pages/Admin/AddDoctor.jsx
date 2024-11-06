import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [specialization_id, setSpecialization_id] = useState('67189ae84130ed457c7291d4')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [description, setDescription] = useState('')

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('phone', phone)
            formData.append('specialization_id', specialization_id)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('description', description)

            // const log formData
            formData.forEach((value, key) => {
                console.log(`${key} : ${value}`);
            })

            const { data } = await axios.post(`${backendUrl}/doctor/create`, formData, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPhone('')
                setPassword('')
                setEmail('')
                setDescription('')

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-500'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Phone Doctor</p>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} className='border rounded px-3 py-2' type="tel" placeholder='Phone' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Specialization_id</p>
                            <select onChange={(e) => setSpecialization_id(e.target.value)} value={specialization_id} className='border rounded px-3 py-2' name="" id="speciality">
                                <option value="67189ae84130ed457c7291d4">Tiêu hóa</option>
                                <option value="Tổng quát">Tổng quát</option>
                                <option value="Sinh sản">Sinh sản</option>
                                <option value="Thần kinh">Thần kinh</option>
                                <option value="Da">Da</option>
                            </select>
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                    </div>
                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full border rounded px-4 pt-2' placeholder='Write about doctor' rows={5} required />
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>

            </div>
        </form>
    )
}

export default AddDoctor