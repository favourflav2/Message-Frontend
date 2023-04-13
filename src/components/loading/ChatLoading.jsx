import { Stack,Skeleton } from '@mui/material'
import React from 'react'

export default function ChatLoading() {
  return (
    <Stack spacing={1} sx={{color:"purple"}} className="mt-5">
        <Skeleton variant="rounded"  className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
        <Skeleton variant="rounded" className="w-[95%] h-[80px]"  sx={{ bgcolor: 'grey.900' }} />
    </Stack>
  )
}
