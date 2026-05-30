import { delay } from 'msw'

export async function simulateNetwork() {
  const ms = 500 + Math.random() * 1500
  await delay(ms)
  if (Math.random() < 0.1) {
    throw new Error('Network error')
  }
}
