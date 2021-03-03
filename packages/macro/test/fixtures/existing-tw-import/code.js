import { tw } from 'twind'
import '../../macro'
const redText = tw`text-red-500`
export default <button tw={[`bg-blue-500`, redText]} />
