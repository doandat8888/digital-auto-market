import { Button } from '@nextui-org/react'
import classNames from 'classnames'
import { TbChevronDown } from 'react-icons/tb'
type StepButtonProps = {
    state: 'active' | 'inactive' | 'completed'
    step: number
    label: string
}

const StepButton = ({ state, step, label }: StepButtonProps) => {
    return (
        <div className='relative text-center'>
            {state === 'active' && (
                <TbChevronDown className='absolute text-xl -translate-x-1/2 left-1/2 bottom-[calc(100%+5px)]' />
            )}

            <Button
                isIconOnly
                radius='full'
                size='sm'
                variant={state === 'active' || state === 'completed' ? 'shadow' : 'bordered'}
                className={classNames(
                    {
                        'bg-aiot-blue-m text-white': state === 'active' || state === 'completed',
                        'bg-white border-gray-400 border opacity-50': state === 'inactive',
                        'pointer-events-none': state === 'inactive',
                    },
                    '!outline-0 hover:border-gray-400'
                )}
            >
                <span className={classNames('text-base font-medium')}>{step}</span>
            </Button>
            <p
                className={classNames(
                    'text-sm -translate-x-1/2 left-1/2 absolute w-40 text-center mt-2',
                    state === 'inactive' ? 'text-gray-500' : 'text-black'
                )}
            >
                {label}
            </p>
        </div>
    )
}

export default StepButton
