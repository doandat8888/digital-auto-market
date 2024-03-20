import StepButton from './StepButton'

const StepProgress = () => {
    return (
        <div className='flex justify-between mt-14 items-center'>
            <StepButton label='Onboarding' step={1} state='active' />
            <div className='flex-1 h-1 bg-gray-200' />
            <StepButton label='Create project' step={2} state='inactive' />
            <div className='flex-1 h-1 bg-gray-200' />
            <StepButton label='Extract endpoint' step={3} state='inactive' />
            <div className='flex-1 h-1 bg-gray-200' />
            <StepButton label='Submit' step={4} state='inactive' />
            <div className='flex-1 h-1 bg-gray-200' />
            <StepButton label='Test your GenAI' step={5} state='inactive' />
        </div>
    )
}

export default StepProgress
