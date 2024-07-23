import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi'
import { useWriteContracts } from 'wagmi/experimental'
import { parseEther } from 'viem'

// Example ABI for a simple transfer function
const ABI = [
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
]

function App() {
  const account = useAccount()
  const { connectors, connect, status, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()

  const { writeContract, data: writeData, error: writeError, isPending: isWritePending, isSuccess: isWriteSuccess } = useWriteContract()
  
  const { writeContracts, data: writeContractsData, error: writeContractsError, isPending: isWriteContractsPending, isSuccess: isWriteContractsSuccess } = useWriteContracts()

  const handleTransactionWithWriteContract = async () => {
    try {
      const result = await writeContract({
        address: '0x1234567890123456789012345678901234567890', // Replace with actual contract address
        abi: ABI,
        functionName: 'transfer',
        args: ['0x1234567890123456789012345678901234567890', parseEther('0.01')], // Replace with actual recipient address
      })
      console.log('Transaction submitted with useWriteContract:', result)
    } catch (err) {
      console.error('Transaction failed with useWriteContract:', err)
    }
  }

  const handleTransactionWithWriteContracts = async () => {
    try {
      const result = await writeContracts({
        contracts: [
          {
            address: '0x1234567890123456789012345678901234567890', // Replace with actual contract address
            abi: ABI,
            functionName: 'transfer',
            args: ['0x1234567890123456789012345678901234567890', parseEther('0.01')], // Replace with actual recipient address
          }
        ]
      })
      console.log('Transaction submitted with useWriteContracts:', result)
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