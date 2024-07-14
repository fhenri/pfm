"use client"

import ITransaction from '@/types/bTransaction';
import DataTableComment from './DataTableComment';
import DataTableCategory from './DataTableCategory';

const DataTableRow = ( props ) => {

  const tx = props.data;
  const isAccountSelected = props.isAccountSelected;

  const formattedEUR = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(parseFloat(tx.AmountEUR))

  //<input type="text" name="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
  //        <td className="transaction-date">{tx.TransactionDate.toLocaleDateString('fr-FR')}</td>

  return (
      <tr>
        {!isAccountSelected && <td className="!text-center">{tx.AccountNumber}</td>}
        <td className="transaction-date">{tx.TransactionDate.toISOString()}</td>
        <td className="transaction-description">{tx.Description}</td>
        <td className="transaction-amount">
        <span className={ tx.Amount > 0 ? 'tx-positive' : 'tx-negative' }>
            { Intl.NumberFormat('fr-FR').format(tx.Amount) }
        </span>
        </td>
        <td className="transaction-amount">
        <span className={ tx.Amount > 0 ? 'tx-positive' : 'tx-negative' }>
            { formattedEUR }
        </span>
        </td>
        <td className="transaction-comment">
            <DataTableComment txId={tx._id} txComment={tx.Comment} />
        </td>
        <td className="transaction-category">
            <DataTableCategory txId={tx._id} txCategories={tx.Categories} />
        </td>
      </tr>
  )
}

export default DataTableRow;
