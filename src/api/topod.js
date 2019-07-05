import request from '@/utils/request'



export function getTreevue() {
  return request({
    url: '/getTreevue',
    method: 'get'

  })
}


export function getdevsv(id, content) {
  return request({
    url: '/getdevs',
    method: 'get',
    params: {
      usergroupid: id,
      sname: content
  }
  })
}

export function getdevlogsv(addr) {
  return request({
    url: '/getdevlogs',
    method: 'get',
    params: {
      addr: addr
  }
  })
}

export function getlogsvuev() {
  return request({
    url: '/getlogs',
    method: 'get'

  })
}