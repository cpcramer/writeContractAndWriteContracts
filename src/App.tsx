import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi'
import { useWriteContracts } from 'wagmi/experimental'
import { parseEther } from 'viem'

// Custom1155 ABI from BOAT - 0x6268A5F72528E5297e5A63B35e523E5C131cC88C
const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

function App() {
  const account = useAccount()
  const { connectors, connect, status, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()

  const { writeContract, data: writeData, error: writeError, isPending: isWritePending, isSuccess: isWriteSuccess } = useWriteContract()
  
  const { writeContracts, data: writeContractsData, error: writeContractsError, isPending: isWriteContractsPending, isSuccess: isWriteContractsSuccess } = useWriteContracts()

  console.log('Account details:', {
    status: account.status,
    address: account.address,
    chainId: account.chainId,
    isConnected: account.isConnected,
    isReconnecting: account.isReconnecting,
    isDisconnected: account.isDisconnected,
  })

  const handleTransactionWithWriteContract = async () => {
    console.log('Initiating transaction with useWriteContract')
    if (!account.address) {
      console.error('No account address available')
      return
    }

    try {
      console.log('writeContract params:', {
        address: '0x6268A5F72528E5297e5A63B35e523E5C131cC88C',
        abi: ABI,
        functionName: 'mint',
        args: ['0x6268A5F72528E5297e5A63B35e523E5C131cC88C', parseEther('0.01')],
      })
      const result = await writeContract({
        address: '0x6268A5F72528E5297e5A63B35e523E5C131cC88C',
        abi: ABI,
        functionName: 'mint',
        args: [account.address, BigInt(1), BigInt(1), '0x'], // account address, id of the token we are minting, amount to mint, data
      })
      console.log('Transaction submitted with useWriteContract:', result)
      console.log('writeContract state:', { writeData, writeError, isWritePending, isWriteSuccess })
    } catch (err) {
      console.error('Transaction failed with useWriteContract:', err)
    }
  }

  const handleTransactionWithWriteContracts = async () => {
    console.log('Initiating transaction with useWriteContracts')
    if (!account.address) {
      console.error('No account address available')
      return
    }
    
    try {
      const params = {
        contracts: [{
          address: '0x6268A5F72528E5297e5A63B35e523E5C131cC88C' as `0x${string}`,
          abi: ABI,
          functionName: 'mint',
          args: [account.address, BigInt(1), BigInt(1), '0x' as `0x${string}`], // account address, id of the token we are minting, amount to mint, data
        }]
      };
      console.log('writeContracts params:', params)
      const result = await writeContracts(params)
      console.log('Transaction submitted with useWriteContracts:', result)
      console.log('writeContracts state:', { writeContractsData, writeContractsError, isWriteContractsPending, isWriteContractsSuccess })
    } catch (err) {
      console.error('Transaction failed with useWriteContracts:', err)
    }
  }

  return (
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {account.status}
          <br />
          address: {account.address}
          <br />
          chainId: {account.chainId}
        </div>
        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{connectError?.message}</div>
      </div>

      {account.status === 'connected' && (
        <div>
          <h2>Transactions</h2>
          <div>
            <h3>useWriteContract</h3>
            <button onClick={handleTransactionWithWriteContract} disabled={isWritePending}>
              Send Transaction With useWriteContract
            </button>
            {isWritePending && <div>Transaction in progress...</div>}
            {isWriteSuccess && <div>Transaction successful! Hash: {writeData}</div>}
            {writeError && <div>Transaction failed: {writeError.message}</div>}
          </div>
          <div>
            <h3>useWriteContracts</h3>
            <button onClick={handleTransactionWithWriteContracts} disabled={isWriteContractsPending}>
              Send Transaction With useWriteContracts
            </button>
            {isWriteContractsPending && <div>Transaction in progress...</div>}
            {isWriteContractsSuccess && <div>Transaction successful! Hash: {writeContractsData}</div>}
            {writeContractsError && <div>Transaction failed: {writeContractsError.message}</div>}
          </div>
        </div>
      )}
    </>
  )
}

export default App