import React from 'react'
import { getInitials } from '../../../utils/helper'

const ProfileInfo = ({onLogout,userInfo}) => {
  return (
    <div className='flex items-center gap-3'>
      <div className="w-12 h-12 flex items-center justify-center rounded-full font-medium text-slate-950 bg-slate-100">
        {
            getInitials(userInfo?.fullName)
        }
      </div>
      <div>
      <p className="text-sm font-medium max-w-32 truncate"> {userInfo?.fullName} </p>
      <button  className='text-sm text-slate-700 underline' onClick={onLogout}>
        Logout
      </button>
      </div>
    </div>
  )
}

export default ProfileInfo
