export function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function dateFormat (date) {
  const time = new Date(date);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
}

export function replaceBig (url) {
  return url.replace('_webp', '').replace('i.pximg.net', 'original.img.cheerfun.dev');
}

export function replaceSmall (url) {
  return url.replace('i.pximg.net', 'img.cheerfun.dev');
}

export function replaceAvatar(url) {
  return `${process.env.VUE_APP_STATIC_API}${url}.jpg`;
}

export function replaceSquare(url) {
  return `https://img.cheerfun.dev/c/360x360_70/img-master${url.split('img-master')[1]}`;
}
