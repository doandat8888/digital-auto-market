import { Button } from '@nextui-org/react'
import StepProgress from '../components/StepProgress'
import { TbBrandGithubFilled } from 'react-icons/tb'

const HackathonSubmit = () => {
    return (
        <div className='w-full h-screen flex flex-col pt-28'>
            <div className='shadow-sm'>
                <div className='max-w-4xl w-full pb-20 mx-auto'>
                    <h1 className='text-5xl'>Submit your GenAI</h1>
                    <div className='px-6'>
                        <StepProgress />
                    </div>
                </div>
            </div>
            <div className='max-w-4xl py-4 mx-auto flex-1 w-full min-h-0 overflow-y-auto'>
                <h2 className='text-base'>Quick start with GitHub</h2>
                <Button radius='sm' className='text-white mt-2 bg-[#111]'>
                    <TbBrandGithubFilled className='text-white text-xl' /> Login with GitHub
                </Button>
            </div>
            <div className='max-w-4xl mx-auto py-4 flex-shrink-0 w-full flex justify-between'>
                <Button radius='sm' color='primary'>
                    Prev
                </Button>
                <Button radius='sm' color='primary'>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default HackathonSubmit
