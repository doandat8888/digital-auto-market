import { Button } from '@nextui-org/react'
import { Link } from 'react-router-dom'

const HackathonGenAI = () => {
    return (
        <div className='h-[calc(100vh)] pt-28 px-10 pb-10'>
            <div className='max-w-[1440px] m-auto'>
                <div className='flex shadow-2xl pt-7 text-white items-center justify-center flex-col m-auto rounded-3xl h-[420px] w-full bg-gradient-to-r from-blue-900 to-sky-600'>
                    <h1 className='text-2xl font-semibold tracking-wide bg-clip-text'>digital.auto</h1>
                    <h1 className='text-6xl xl:text-8xl font-semibold tracking-wider mt-4 text-center'>
                        Gen AI Hackathon
                    </h1>
                    <Button
                        radius='sm'
                        as={Link}
                        to='/hackathon/submit'
                        color='primary'
                        size='lg'
                        className='h-fit bg-black mt-8 py-3 px-7 shadow-black/30'
                        variant='shadow'
                    >
                        <span className='text-xl font-semibold'>Join now</span>
                    </Button>
                </div>
                <p className='mt-10 text-5xl leading-snug text-[#333] text-center'>
                    Revolution in the automotive industry.
                    <br />
                    Gen AI for the future of mobility.
                </p>

                <div className='mt-56 text-base space-y-4'>
                    <h2 className='text-5xl'>Information here</h2>
                    <p className=''>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a semper sapien. Proin
                        hendrerit id ex a euismod. Curabitur venenatis consectetur iaculis. Vestibulum ante ipsum primis
                        in faucibus orci luctus et ultrices posuere cubilia curae; Nam commodo vel dui nec viverra.
                        Curabitur pulvinar, ligula ut egestas dapibus, neque nulla euismod tellus, vel porta tellus
                        libero vitae eros. Aenean sed quam egestas, imperdiet urna at, varius tellus.
                    </p>
                    <p>
                        Nunc vehicula, ex ut lacinia vulputate, arcu leo rutrum leo, ut bibendum leo augue non neque.
                        Nulla facilisi. Nulla facilisi. Etiam sed varius turpis. Phasellus dapibus mattis purus a
                        luctus. Vestibulum egestas scelerisque libero ut dapibus. Pellentesque congue libero eu lorem
                        lacinia, ut eleifend lectus imperdiet. Cras laoreet ac quam quis porttitor. Aenean aliquam vel
                        purus vitae volutpat.
                    </p>
                    Pellentesque sed lectus accumsan justo maximus scelerisque ut nec metus. Nulla vel commodo mi, et
                    dictum nisi. Sed ac dolor sed elit mollis blandit. Nam quis faucibus libero. Maecenas ac luctus
                    risus. Praesent tincidunt lobortis ipsum at efficitur. Morbi posuere nisi nec purus consequat
                    volutpat. Duis est neque, sodales sed ultricies in, malesuada ut ligula. Vivamus lacus quam,
                    lobortis sed leo eget, iaculis molestie risus. Sed ac eros sollicitudin dolor suscipit venenatis id
                    a tellus.
                    <p>
                        Nullam malesuada tempor congue. Donec nisi felis, facilisis nec viverra at, ornare eget neque.
                        Quisque congue nunc eu diam mollis malesuada. Proin a felis ante. Maecenas orci diam,
                        scelerisque a lobortis a, mollis et nibh. Suspendisse potenti. Donec ut dignissim sapien. Cras
                        porttitor posuere egestas. Sed tempus dolor ac porttitor volutpat. Curabitur vestibulum iaculis
                        purus, varius egestas neque condimentum pretium. Nam iaculis lacus sit amet nisl venenatis, eu
                        molestie lacus gravida. Ut varius neque id diam laoreet interdum. Orci varius natoque penatibus
                        et magnis dis parturient montes, nascetur ridiculus mus. Nam egestas felis vitae diam volutpat
                        elementum. In sit amet tortor quis est blandit porttitor ac sed lectus.
                    </p>
                    Ut efficitur sem at quam gravida, eleifend feugiat lectus gravida. Fusce feugiat mi sed neque ornare
                    suscipit. Sed odio risus, lacinia vel aliquam nec, porta non nibh. Maecenas consectetur fermentum
                    ipsum, a volutpat est lacinia in. In hac habitasse platea dictumst. Nullam et hendrerit quam.
                    Phasellus viverra, dui eu bibendum sollicitudin, neque dolor consequat eros, in luctus nulla felis
                    in nulla. Duis eleifend auctor auctor. Proin accumsan tempor semper. Nam tempus id nunc id placerat.
                    Pellentesque urna metus, dapibus at pretium sit amet, sollicitudin a leo. Praesent eu condimentum
                    augue, facilisis porta nisi. Aliquam massa nibh, pharetra vestibulum neque vitae, ultrices eleifend
                    libero. Phasellus ac velit accumsan mi pharetra venenatis.
                </div>
            </div>
        </div>
    )
}

export default HackathonGenAI
