import React, { useState, useEffect } from 'react';
import { dummyPublishedCreationData } from '../assets/assets';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const {getToken} = useAuth();

  const fetchCreations = async () => {
    try{
        const {data} = await axios.get('/api/user/get-published-creations',{
            headers:{Authorization : `Bearer ${await getToken()}`}
        });
        if(data.success){
            setCreations(data.creations);
        }else{
            toast.error(data.message);
        }
    }
    catch(error){
            toast.error(error.message);     
        }
        setLoading(false);
}
  const imageLikeToggle = async (id) => {
    try{
        const {data} = await axios.post('/api/user/toggle-like-creation',{id},{
            headers:{Authorization : `Bearer ${await getToken()}`}
            });
        if(data.success){
            toast.success(data.message);
            await fetchCreations();
        }else{  
            toast.error(data.message);  
        }
        }
        catch(error){
            toast.error(error.message);     
        }   
    }
  useEffect(() => {
    if (user) {
        fetchCreations();
    }
  }, [user]);

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className="text-2xl font-semibold text-gray-700">Creations</h2>
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll p-4 flex flex-wrap gap-4'>
        {creations.length === 0 ? (
          <p className="text-gray-500">No creations to show.</p>
        ) : (
          creations.map((creation, index) => (
            <div
              key={index}
              className='relative group inline-block w-full sm:w-[48%] lg:w-[32%]'
            >
              <img
                src={creation.content}
                alt=''
                className='w-full h-60 object-cover rounded-lg'
              />
              <div className='absolute inset-0 flex flex-col justify-end p-3 rounded-lg group-hover:bg-gradient-to-b from-transparent to-black/80 text-white transition-all'>
                <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
                <div className='flex gap-1 items-center mt-2'>
                  <p>{creation.likes.length}</p>
                  <Heart onClick={()=>imageLikeToggle(creation.id)}
                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                      creation.likes.includes(user.id)
                        ? 'fill-red-500 text-red-600'
                        : 'text-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
        <span className='w-10 h-10 my-1 rounded-full border-3 border-primary 
        border-t-transparent animate-spin'>
        </span>
    </div>    
  )
}

export default Community;
